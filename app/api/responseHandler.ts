import { NextResponse } from 'next/server'

export const successResponse = (data: any, statusCode = 200) =>
  NextResponse.json({ data }, { status: statusCode })

export const errorResponse = (message: string, statusCode = 400) =>
  NextResponse.json({ error: message }, { status: statusCode })
