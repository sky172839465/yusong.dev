const getFileUrl = (relativeFile) => {
  if (import.meta.env.PROD) {
    return `https://cdn.yusong.dev{relativeFile}?v=20250222`
  }

  return new URL(relativeFile, import.meta.url).href
}

export default getFileUrl
