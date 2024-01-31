import { Result, ResultNS } from 'true-myth'

// As we do not use ES6 modules, I could not find more elegant way to import Ok
type Ok<T, E> = ResultNS.Ok<T, E>
type Err<T, E> = ResultNS.Err<T, E>

// check that `Result` is `Ok`, i.e. does not return an error
export function expectToBeOk<T, E>(v: Result<T, E>): asserts v is Ok<T, E> {
  expect(v.isOk).toBe(true)
}

// check that `Result` is `Err`, i.e. returns an error
export function expectToBeErr<T, E>(v: Result<T, E>): asserts v is Err<T, E> {
  expect(v.isErr).toBe(true)
}
