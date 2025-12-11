import { NextRequest, NextResponse } from "next/server";
import routesManifest from "./routes-manifest.json";

const env = {
    NEXTJS_ENV: process.env.NEXT_PUBLIC_ENV,
    TEST: process.env.TEST,
}

export async function middleware(request: NextRequest) {
    console.log(env.NEXTJS_ENV)

    const nextUrl = request.nextUrl;
    const pathName = nextUrl.pathname;

    const exists = routesManifest.routes.some((route) => {
        // Dynamic route 지원
        if (route.includes('[')) {
            const regex = new RegExp('^' + route.replace(/\[.*?\]/g, '[^/]+') + '$');
            return regex.test(pathName);
        }
        return route === pathName;
    });

    if (!exists) {
        return NextResponse.redirect(new URL('/', nextUrl));
    }
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}