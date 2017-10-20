const path = require('path')

function createSlug({ relativePath }) {
  let { name, dir } = path.parse(relativePath)

  name = name.split('.')[0]

  let slug = ''

  if (name == 'index') {
    slug = `/${dir}`
  } else if (dir != '' && name != '') {
    slug = `/${dir}/${name}`
  } else if (name != '') {
    slug = `/${name}`
  }

  if (slug != '/' && slug.endsWith('/')) slug = slug.slice(0, slug.length - 1)

  return slug
}

exports.createPages = async ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  const result = await graphql(`
    {
      files: allFile(filter: { extension: { regex: "/md/" } }) {
        edges {
          node {
            relativePath
            absolutePath
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.error(result.errors)
    throw result.errors
  }

  const blogPost = path.resolve('src/templates/blog-post.js')
  result.data.files.edges.forEach(async ({ node }) => {
    createPage({
      path: node.fields.slug, // required
      component: blogPost,
      context: {
        slug: node.fields.slug,
      },
    })
  })
}

exports.onCreateNode = async ({ node, boundActionCreators, getNode, loadNodeContent }) => {
  const { createNode, createNodeField, createParentChildLink } = boundActionCreators

  if (node.internal.type === 'File') {
    const slug = createSlug({ relativePath: node.relativePath })
    createNodeField({ node, name: 'slug', value: slug })
  }
}
