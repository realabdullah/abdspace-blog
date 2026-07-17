export const formatDate = (isoString?: string): string => {
	if (!isoString) return "";
	return new Intl.DateTimeFormat("en-NG", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(isoString));
};
