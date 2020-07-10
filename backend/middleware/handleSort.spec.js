const { handleSort, checkParamsError, makeSortFunction } = require("./handleSort");


describe("handleSort", () => {
    const [a, b, c] = [{ likes: 23 }, { likes: 1 }, { likes: 99 }]
    const foundPosts = [ a, b, c ]
    
    test("it should sort the array in request according to the query params", () => {
        const mockReq = { query: { sortBy: "likes", direction: "desc"}, foundPosts };
        const mockNext = jest.fn();
        handleSort(mockReq, "res", mockNext)
        expect(mockReq.foundPosts[0]).toBe(c)
    })
    
    test("it should call next with an error if params contains error", () => {
        const mockReq = { query: { sortBy: "invalid", direction: "desc"}, foundPosts };
        const mockNext = jest.fn();
        handleSort(mockReq, "res", mockNext)
        expect(mockNext).toBeCalled()
    })


})

describe("checkParamsError", () => {
    test("it should return null when params provided is in the valid set", () => {
        expect(checkParamsError("id", "desc")).toBeNull()
        expect(checkParamsError("reads", "asc")).toBeNull()
        expect(checkParamsError("likes", "asc")).toBeNull()
    })

    test("it should return Error when params provided is not in the valid set", () => {
        expect(checkParamsError("pig", "desc")).toBeInstanceOf(Error)
        expect(checkParamsError("id", "pig")).toBeInstanceOf(Error)
    })
})

describe("makeSortFunction", () => {
    const [a, b, c] = [{ likes: 23 }, { likes: 1 }, { likes: 99 }]
    const foundPosts = [ a, b, c ]

    test("it should makes a correct sortFunction", () => {
        expect(foundPosts.sort(makeSortFunction("likes", "desc"))[0]).toBe(c);
        expect(foundPosts.sort(makeSortFunction("likes", "desc"))[1]).toBe(a);
        expect(foundPosts.sort(makeSortFunction("likes", "desc"))[2]).toBe(b);

        expect(foundPosts.sort(makeSortFunction("likes", "asc"))[0]).toBe(b);
        expect(foundPosts.sort(makeSortFunction("likes", "asc"))[1]).toBe(a);
        expect(foundPosts.sort(makeSortFunction("likes", "asc"))[2]).toBe(c);
    });
})