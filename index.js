const { Policy, CancellationTokenSource } = require('cockatiel')

const failCallback = () =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('custom'), 1000))
  )

const main = async () => {
  const retryPolicy = Policy.handleAll()
    .retry()
    .exponential({ maxDelay: 10 * 1000 })

  const cancellationTokenSource = new CancellationTokenSource()

  let count = 0
  retryPolicy.onRetry(() => {
    ++count

    console.log('retrying', count)
    if (count > 5) {
      console.log('canceling at', count)
      cancellationTokenSource.cancel()
    }
  })

  const result = await retryPolicy.execute(
    () => failCallback(),
    cancellationTokenSource
  )

  console.log(result)
}

main()
