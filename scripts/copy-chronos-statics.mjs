#!/usr/bin/env ts-node

// @ts-check

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Stylog } from 'toolbox-x/stylog';
import { Project, Scope } from 'ts-morph';

const CHRONOS_PATH = resolve('src/classes/Chronos.ts');
const OUTPUT_PATH = resolve('src/types/chronos-statics.ts');

const CONSTRUCTOR_REMARKS = `\t*\n\t* @remarks
\t* - This function serves as a wrapper around the {@link Chronos} class constructor.\n\t* - It allows you to create a new \`Chronos\` instance from \`number\`, \`string\`, {@link Date}, {@link Chronos}, or individual date-time components.`;

const project = new Project({
	skipAddingFilesFromTsConfig: false,
});

const sourceFile = project.addSourceFileAtPath(CHRONOS_PATH);
project.addSourceFilesAtPaths('src/types/*.ts');

const chronosClass = sourceFile.getClassOrThrow('Chronos');

// Build type to path mapping
const typeToPath = new Map();
typeToPath.set('Chronos', 'src/classes/Chronos');

const typeFiles = project.getSourceFiles();
for (const file of typeFiles) {
	const base = file.getBaseNameWithoutExtension();
	if (base === 'Chronos' || base === 'chronos-statics' || base === 'chronos-statics-exp') {
		continue;
	}
	const exports = file.getExportedDeclarations();
	for (const name of exports.keys()) {
		typeToPath.set(name, `src/types/${base}`);
	}
}

// Map external/other imports from Chronos.ts
const chronosImports = sourceFile.getImportDeclarations();
for (const imp of chronosImports) {
	const moduleSpecifier = imp.getModuleSpecifierValue();
	if (moduleSpecifier === 'src/types') {
		continue;
	}
	for (const spec of imp.getNamedImports()) {
		const name = spec.getName();
		typeToPath.set(name, moduleSpecifier);
	}
}

/** @type {string[]} */
const bodyLines = [];

const usedTypes = new Set();

/**
 * @param {string} text
 */
const addUsedTypesFromText = (text) => {
	if (!text) return;
	const matches = text.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/g);
	if (matches) {
		for (const word of matches) {
			if (typeToPath.has(word)) {
				usedTypes.add(word);
			}
		}
	}
};

// Generate constructor signatures
const constructors = chronosClass.getConstructors();
const constructorOverloads = constructors.flatMap((ctor) => {
	const overloads = ctor.getOverloads();
	return overloads.length > 0 ? overloads : [ctor];
});

for (const ctor of constructorOverloads) {
	const docs = ctor.getJsDocs();

	let docText = '';

	if (docs.length > 0) {
		docText = docs
			.map((doc) => doc.getText(true))
			.join('\n')
			.replace(/\*\/\s*$/, '')
			.trimEnd();

		docText += '\n';
		docText += CONSTRUCTOR_REMARKS;
		docText += '\n */';
	} else {
		docText = `/**\n${CONSTRUCTOR_REMARKS}\n */`;
	}

	bodyLines.push('');

	for (const line of docText.split('\n')) {
		bodyLines.push(`\t${line.replace(/@statics?/g, '*')}`);
	}

	addUsedTypesFromText('Chronos');

	const params = ctor
		.getParameters()
		.map((param) => {
			const name = param.getName();
			const type = param.getTypeNode()?.getText() ?? param.getType().getText(param);
			addUsedTypesFromText(type);
			const optional = param.isOptional() ? '?' : '';

			return `${name}${optional}: ${type}`;
		})
		.join(', ');

	bodyLines.push(`\t(${params}): Chronos;`);
}

// Generate static methods (excluding private ones like starting with '#')
const staticMethods = chronosClass
	.getMethods()
	.filter(
		(method) =>
			method.isStatic() &&
			method.getScope() === Scope.Public &&
			!method.getName().startsWith('#')
	);

for (const method of staticMethods) {
	const overloads = method.getOverloads();

	const methodsToEmit = overloads.length > 0 ? overloads : [method];

	for (const current of methodsToEmit) {
		bodyLines.push('');

		const docs = current.getJsDocs();

		for (const doc of docs) {
			for (const line of doc.getText().split('\n')) {
				bodyLines.push(`\t${line.replace(/@statics?/g, '*')}`);
			}
		}

		const params = current
			.getParameters()
			.map((param) => {
				const name = param.getName();
				const type = param.getTypeNode()?.getText() ?? param.getType().getText(param);
				addUsedTypesFromText(type);
				const optional = param.isOptional() ? '?' : '';

				return `${name}${optional}: ${type}`;
			})
			.join(', ');

		const returnType =
			current.getReturnTypeNode()?.getText() ?? current.getReturnType().getText(current);
		addUsedTypesFromText(returnType);

		bodyLines.push(`\t${method.getName()}(${params}): ${returnType};`);
	}
}

// Group imports by module
const importsByModule = new Map();
for (const typeName of usedTypes) {
	const modulePath = typeToPath.get(typeName);
	if (!importsByModule.has(modulePath)) {
		importsByModule.set(modulePath, []);
	}
	importsByModule.get(modulePath).push(typeName);
}

// Generate import statements
const importLines = [];
for (const [modulePath, names] of importsByModule.entries()) {
	importLines.push(`import type { ${names.join(', ')} } from '${modulePath}';`);
}

// Assemble final file content
const finalLines = [
	...importLines,
	'',
	`/** All the statics methods and constructor signatures in \`Chronos\` class */`,
	`export interface ChronosStatics {`,
	...bodyLines,
	`}`,
	'',
];

writeFileSync(OUTPUT_PATH, finalLines.join('\n'));

console.info(
	Stylog.ansi16('blue').toANSI(
		`Generated interface ${Stylog.bold.toANSI('ChronosStatics')}: ${Stylog.underline.toANSI(OUTPUT_PATH)}`
	)
);
