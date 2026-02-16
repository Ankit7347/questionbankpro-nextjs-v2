// src/app/api/course/byslug/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ok, fail } from "@/lib/response.util";
import { getCourseBySlug } from "@/services/server/course.server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug } = body;
        const data = await getCourseBySlug(slug);
        return NextResponse.json(ok(data, 201));
    } catch (error) {
        return NextResponse.json(fail(error));
    }
}
