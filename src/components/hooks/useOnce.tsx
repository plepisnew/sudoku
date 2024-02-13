import { useEffect, useState } from "react";

export const useOnce = (fn: () => void) => {
	const [hasRun, setHasRun] = useState(false);

	useEffect(() => {
		if (!hasRun) {
			fn();
			setHasRun(true);
		}
	}, [hasRun, fn, setHasRun]);
};
