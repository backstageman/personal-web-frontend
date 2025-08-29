/**
 * 过滤对象中的无效参数:
 * - 去掉 null / undefined
 * - 去掉空字符串 ""
 * - 自动 trim 字符串
 */
export function cleanQueryParams<T extends Record<string, any>>(
  params: T
): Partial<T> {
  const cleaned: Partial<T> = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value === null || value === undefined) {
      return; // 过滤掉 null 和 undefined
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed !== '') {
        cleaned[key as keyof T] = trimmed as T[keyof T];
      }
      return;
    }

    // 数字、布尔值、日期等直接保留
    cleaned[key as keyof T] = value;
  });

  return cleaned;
}

type ISOConvertible = string | number | Date;
type ReplaceKeysWithString<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string;
};

export function convertDatesToISO<
  T extends Record<string, unknown>,
  K extends keyof T
>(params: T, keys: readonly K[]): ReplaceKeysWithString<T, K> {
  // 用 any 接管写入，返回时给出精确的 ReplaceKeysWithString 类型
  const res: any = { ...params };

  for (const key of keys) {
    const v = res[key] as ISOConvertible | null | undefined;
    if (v == null) continue;

    // 已是 Date
    if (v instanceof Date) {
      res[key] = v.toISOString();
      continue;
    }

    // 字符串或数字 -> Date
    const d = new Date(v as string | number);
    if (!Number.isNaN(d.getTime())) {
      res[key] = d.toISOString();
    }
  }

  return res as ReplaceKeysWithString<T, K>;
}
