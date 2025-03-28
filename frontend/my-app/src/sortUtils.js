export const sortTopics = (option, topicsToSort) => {
	let sortedTopics = []

	switch (option) {
		case 'ascendingTitle':
			sortedTopics = [...topicsToSort].sort((a, b) =>
				a.title.localeCompare(b.title, 'ru')
			)
			break
		case 'descendingTitle':
			sortedTopics = [...topicsToSort].sort((a, b) =>
				b.title.localeCompare(a.title, 'ru')
			)
			break
		case 'ascendingDate':
			sortedTopics = [...topicsToSort].sort((a, b) =>
				b.createAt.localeCompare(a.createAt, 'ru')
			)
			break
		case 'descendingDate':
			sortedTopics = [...topicsToSort].sort((a, b) =>
				a.createAt.localeCompare(b.createAt, 'ru')
			)
			break
		case 'ascendingMessages':
			sortedTopics = [...topicsToSort].sort(
				(a, b) => (a.numberOfMessages || 0) - (b.numberOfMessages || 0)
			)
			break
		case 'descendingMessages':
			sortedTopics = [...topicsToSort].sort(
				(a, b) => (b.numberOfMessages || 0) - (a.numberOfMessages || 0)
			)
			break
		case 'ascendingViews':
			sortedTopics = [...topicsToSort].sort(
				(a, b) => (a.numberOfViews || 0) - (b.numberOfViews || 0)
			)
			break
		case 'descendingViews':
			sortedTopics = [...topicsToSort].sort(
				(a, b) => (b.numberOfViews || 0) - (a.numberOfViews || 0)
			)
			break
		default:
			sortedTopics = topicsToSort
			break
	}

	return sortedTopics
}
