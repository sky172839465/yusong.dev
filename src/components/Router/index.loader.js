const loader = ({ request }) => {
  const { pathname } = new URL(request.url)
  console.log(pathname)
  return {}
}

export default loader
