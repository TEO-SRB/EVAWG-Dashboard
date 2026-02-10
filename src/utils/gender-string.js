export function gender_string (val, gender) {
    if (val == 1) {
        return `1 ${gender}`
    } else {
        return `${val} ${gender}s`
    }
}