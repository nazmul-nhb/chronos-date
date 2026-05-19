'use client';

import { Star } from 'lucide-react';
import { Fragment, use } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useCountUp } from '@/hooks/use-count-up';
import { gitConfig } from '@/lib/shared';
import type { GitHubRepo } from '@/types/index';

const fetchRepo = (async () => {
	const res = await fetch(`https://api.github.com/repos/${gitConfig.user}/${gitConfig.repo}`);

	return res.json() as GitHubRepo;
})();

export function GithubStars() {
	const repo = use(fetchRepo);

	const stars = useCountUp(repo.stargazers_count);

	return (
		<span className="flex items-center gap-1 text-sm">
			<FaGithub className="size-4" />
			{stars ? (
				<Fragment>
					<Star className="size-4" />
					<span className="tabular-nums mt-0.5">{stars}</span>
				</Fragment>
			) : null}
		</span>
	);
}
