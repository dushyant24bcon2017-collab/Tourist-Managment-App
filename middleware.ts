import { NextResponse ,NextRequest} from 'next/server'


export function middleware(req: NextRequest) {
 const path = req.nextUrl.pathname

  const isPublicPath =  path === '/login' || path === '/signup'

  const token = req.cookies.get('auth_token')?.value || ''

  if (!token && !isPublicPath) {
   
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }


  if (token && isPublicPath) {
    
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}