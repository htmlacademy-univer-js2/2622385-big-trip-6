function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomObjectField(object) {
    const values = Object.values(object);
    return values[Math.floor(Math.random() * values.length)];
}

export {getRandomArrayElement};
export {getRandomObjectField}