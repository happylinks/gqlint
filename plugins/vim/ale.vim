call ale#linter#Define('graphql', {
    \   'name': 'gqlint',
    \   'executable': 'gqlint',
    \   'command': 'gqlint --reporter=simple %t',
    \   'callback': 'ale#handlers#unix#HandleAsWarning',
\})
