const { 
  handleTags,
  checkParamError,
  getResultsForAllTags,
  mergeUniquePost,
  fetchAndCacheResultFromAPI 
} = require('./handleTagSearch');

describe("fetchAndCacheResultFromAPI", () => {
  test("it should make a network request with the provided serach term", async () => {
    const mockFetch = jest.fn();
    const data = ["post1", "post2"]

    mockFetch.mockReturnValueOnce({ data: { posts: data }})

    const searchTerm = "testing"
    const API = `https://hatchways.io/api/assessment/blog/posts?tag=`
    const res = await fetchAndCacheResultFromAPI(mockFetch, searchTerm)
    expect(mockFetch).toBeCalledWith(API + searchTerm);
    expect(res).toBe(data)
  })
})

describe("mergeUniquePost", () => {
  const [a, b, c] = [{ id: 2}, { id: 3 }, { id: 2 }];
  const arr = [[a, b], [b, c]];
  test("it should merge arrays of arrays with no duplication based on unique id", () => {
    expect(mergeUniquePost(arr)).toHaveLength(2)
  })

  const [d, e, f] = [{ id: 1}, { id: 3 }, { id: 2 }];
  const arr2 = [[d, e], [e, f]];
  test("it should merge arrays of arrays with no duplication based on unique id", () => {
    expect(mergeUniquePost(arr2)).toHaveLength(3)
  })
})

describe("getResultsForAllTags", () => {
  test("it should only make a network call for a seen search term once", async () => {
    const mockFetchGet = jest.fn();
    const tags = ["one"]
    mockFetchGet.mockReturnValueOnce({ data: { posts: ["firstPost"]}})
      .mockReturnValueOnce({ data: { posts: ["firstPost"]}})
    
    await getResultsForAllTags(mockFetchGet, tags)
    await getResultsForAllTags(mockFetchGet, tags)
    expect(mockFetchGet).toBeCalledTimes(1)
  })

  test("it should make network calls for all tags", async () => {
    const mockFetchGet = jest.fn();
    const tags = ["A", "B", "C", "D"]
    mockFetchGet.mockReturnValueOnce({ data: { posts: ["firstPost"]}})
      .mockReturnValueOnce({ data: { posts: ["firstPost"]}})
      .mockReturnValueOnce({ data: { posts: ["firstPost"]}})
      .mockReturnValueOnce({ data: { posts: ["firstPost"]}})
    
    await getResultsForAllTags(mockFetchGet, tags)
    expect(mockFetchGet).toBeCalledTimes(4);
  })
})
