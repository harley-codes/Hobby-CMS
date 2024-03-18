export function recordToArray<K extends string | number | symbol, V>(record: Record<K, V>)
{
	return Object.entries(record).map(([key, value]) => ({ key, value })) as { key: K, value: V }[]
}
