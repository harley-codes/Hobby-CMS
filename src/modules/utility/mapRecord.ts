export function mapRecord<K extends string | number, V, R>(record: Record<K, V>, callback: (value: V, key: K) => R): R[]
{
	return Object.entries(record).map(([key, value]) => callback(value as V, key as K))
}
