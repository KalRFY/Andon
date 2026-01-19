function isNotEmpty(object, ignoringKeyEmpty) {
    let isNotEmpty = false;
    for (const key in object) {
        const value = object[key];
        console.log(key);
        console.log(value);
        console.log(value == "" || value == "null" || value == null);
        if (
            (value == "" || value == "null" || value == null) &&
            key != ignoringKeyEmpty
        ) {
            return false;
            // break;
        } else {
            isNotEmpty = true;
        }
    }
    return isNotEmpty;
}

export default isNotEmpty;