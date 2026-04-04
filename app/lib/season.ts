/** Returns academic-year season label for a given date, e.g. "2025/26" */
export function getSeasonLabel(date: Date = new Date()): string {
    const month = date.getMonth() // 0 = Jan
    const year = date.getFullYear()
    if (month >= 7) return `${year}/${(year + 1).toString().slice(2)}`
    return `${year - 1}/${year.toString().slice(2)}`
}
