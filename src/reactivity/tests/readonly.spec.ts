import { isReadonly, readonly } from "../reactive"

describe("readonly", () => {
    it("happy path", () => {
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1)
    }
    )
    it("warn then call set", () => {
        // mock
        console.warn = jest.fn()
        const userCopy = {
            age: 10
        }
        const user = readonly({
            age: 10
        })
        user.age = 11
        expect(console.warn).toHaveBeenCalled()
        // isReadonly
        expect(isReadonly(user)).toBe(true)
        expect(isReadonly(userCopy)).toBe(false)
    }
    )
})