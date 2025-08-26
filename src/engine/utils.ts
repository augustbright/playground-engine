const currentId = { value: 0 };

export const makeId = () => {
    currentId.value += 1;
    return currentId.value;
};
