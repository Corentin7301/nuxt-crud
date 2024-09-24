import { watch } from 'node:fs/promises'

export async function watchSchema(schemaPath: string, onChangeCallback: () => void) {
  try {
    const watcher = watch(schemaPath)
    for await (const event of watcher) {
      if (event.eventType === 'change') {
        console.log('schema.prisma changed, regenerating CRUD...')
        onChangeCallback()
      }
    }
  }
  catch (error) {
    console.error('Error watching schema.prisma:', error)
  }
}