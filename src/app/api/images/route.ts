'use server';

import type { NextRequest } from 'next/server';
import OSS from 'ali-oss';
import { Photo } from '@/app/page';

const REGIONS = ["ne", "nc", "ec", "sc", "mc", "sw", "nw"];
const REGION_MAP: Record<string, string> = {
    ne: '东北',
    nc: '华北',
    ec: '华东',
    sc: '华南',
    mc: '华中',
    sw: '西南',
    nw: '西北',
};
const VIDEO_REGEX = /\.(mp4|mov|avi|wmv|mkv|flv|webm)$/i;
const client = new OSS({
    region: 'oss-cn-hangzhou',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
    authorizationV4: true,
    bucket: 'tlias-cesium',
    endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
});

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const region = searchParams.get('region') || 'all';
    if (region === 'all') {
        const photos = await Promise.all(REGIONS.map(async (region) => await getPhotosByRegion(region)));
        return new Response(JSON.stringify(photos.flat()), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    if (!REGIONS.includes(region)) {
        return new Response(JSON.stringify({ error: 'Invalid region' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const photos = await getPhotosByRegion(region);
    return new Response(JSON.stringify(photos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

async function getPhotosByRegion(region: string): Promise<Photo[]> {
    const resp = await client.listV2({
        prefix: `sakiko-love/${region}/`,
        'max-keys': 1000,
    });
    return resp.objects.filter((obj) => !obj.name.endsWith(`${region}/`)).map((obj) => {
        return {
            src: `https://tlias-cesium.oss-cn-hangzhou.aliyuncs.com/${obj.name}`,
            alt: obj.name.split('/').pop()?.split('.')[0] || '',
            region: REGION_MAP[region] || '',
            isVideo: VIDEO_REGEX.test(obj.name),
        }
    });
}