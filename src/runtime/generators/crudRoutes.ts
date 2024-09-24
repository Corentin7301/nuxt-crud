import { getRouteTemplate } from '../templates/getRoute'
import { postRouteTemplate } from '../templates/postRoute'
import { patchRouteTemplate } from '../templates/patchRoute'
import { deleteRouteTemplate } from '../templates/deleteRoute'

interface CRUDRoute {
  route: string
  handler: string
  method: string
  content: string
}

export function generateCRUDRoutes(model: string): CRUDRoute[] {
  const lowercaseModel = model.toLowerCase()
  return [
    {
      route: `/api/${lowercaseModel}/index.get`,
      handler: `api/${lowercaseModel}/index.get.ts`,
      method: 'get',
      content: getRouteTemplate(model),
    },
    {
      route: `/api/${lowercaseModel}/index.post`,
      handler: `api/${lowercaseModel}/index.post.ts`,
      method: 'post',
      content: postRouteTemplate(model),
    },
    {
      route: `/api/${lowercaseModel}/[id].patch`,
      handler: `api/${lowercaseModel}/[id].patch.ts`,
      method: 'patch',
      content: patchRouteTemplate(model),
    },
    {
      route: `/api/${lowercaseModel}/[id].delete`,
      handler: `api/${lowercaseModel}/[id].delete.ts`,
      method: 'delete',
      content: deleteRouteTemplate(model),
    },
  ]
}
