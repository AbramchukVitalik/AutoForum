import { sortTopics } from './sortUtils.js'

describe('Функция sortTopics', () => {
	const topics = [
		{
			title: 'Арматура',
			createAt: '2025-03-05T21:29:39.049Z',
			numberOfMessages: 10,
			numberOfViews: 100,
		},
		{
			title: 'Бочка',
			createAt: '2025-03-15T21:35:14.741Z',
			numberOfMessages: 5,
			numberOfViews: 300,
		},
		{
			title: 'Ведро',
			createAt: '2025-03-25T23:10:05.390Z',
			numberOfMessages: 8,
			numberOfViews: 200,
		},
	]

	test('при неизвестном option функция возвращает исходный массив', () => {
		const result = sortTopics('test', topics)
		expect(result).toEqual(topics)
	})

	describe('Сортировка заголовка по алфавиту', () => {
		test('ascendingTitle — сортирует по заголовки по алфавиту в порядке убывания', () => {
			const result = sortTopics('ascendingTitle', topics)
			expect(result.map(topic => topic.title)).toEqual([
				'Арматура',
				'Бочка',
				'Ведро',
			])
		})

		test('descendingTitle — сортирует по заголовки по алфавиту в порядке возрастания', () => {
			const result = sortTopics('descendingTitle', topics)
			expect(result.map(topic => topic.title)).toEqual([
				'Ведро',
				'Бочка',
				'Арматура',
			])
		})
	})

	describe('Сортировка по дате создания', () => {
		test('ascendingDate — сортирует так, что самые новые даты возвращаются первыми', () => {
			const result = sortTopics('ascendingDate', topics)
			expect(result.map(topic => topic.createAt)).toEqual([
				'2025-03-25T23:10:05.390Z',
				'2025-03-15T21:35:14.741Z',
				'2025-03-05T21:29:39.049Z',
			])
		})

		test('descendingDate — сортирует так, что самые старые даты возвращаются первыми', () => {
			const result = sortTopics('descendingDate', topics)
			expect(result.map(topic => topic.createAt)).toEqual([
				'2025-03-05T21:29:39.049Z',
				'2025-03-15T21:35:14.741Z',
				'2025-03-25T23:10:05.390Z',
			])
		})
	})

	describe('Сортировка по количеству сообщений', () => {
		test('ascendingMessages — сортирует по количеству сообщений по возрастанию', () => {
			const result = sortTopics('ascendingMessages', topics)
			expect(result.map(topic => topic.numberOfMessages)).toEqual([5, 8, 10])
		})

		test('descendingMessages — сортирует по количеству сообщений по убыванию', () => {
			const result = sortTopics('descendingMessages', topics)
			expect(result.map(topic => topic.numberOfMessages)).toEqual([10, 8, 5])
		})
	})

	describe('Сортировка по количеству просмотров', () => {
		test('ascendingViews — сортирует по количеству просмотров по возрастанию', () => {
			const result = sortTopics('ascendingViews', topics)
			expect(result.map(topic => topic.numberOfViews)).toEqual([100, 200, 300])
		})

		test('descendingViews — сортирует по количеству просмотров по убыванию', () => {
			const result = sortTopics('descendingViews', topics)
			expect(result.map(topic => topic.numberOfViews)).toEqual([300, 200, 100])
		})
	})
})
