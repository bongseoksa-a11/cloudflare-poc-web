# Cloudflare POC Web

Next.js 애플리케이션을 Cloudflare Workers에 배포하기 위한 POC 프로젝트입니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [Cloudflare 설정](#cloudflare-설정)
- [시작하기](#시작하기)
- [빌드 및 배포](#빌드-및-배포)
- [주의사항](#주의사항)
- [문제 해결](#문제-해결)

## 🛠 기술 스택

- **Framework**: Next.js 14.2.33
- **Runtime**: Cloudflare Workers
- **Adapter**: @opennextjs/cloudflare
- **Package Manager**: pnpm
- **Language**: TypeScript

## ⚙️ Cloudflare 설정

### 1. wrangler.toml

Cloudflare Workers 설정 파일입니다.

```toml
name = "cloudflare-poc-web"
compatibility_date = "2025-12-04"
compatibility_flags = ["nodejs_compat"]

main = ".open-next/worker.js"

[build]
command = "pnpm run build"

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

**주요 설정 항목:**
- `name`: Worker 이름 (Cloudflare 대시보드에 표시됨)
- `compatibility_date`: Cloudflare Workers 호환성 날짜
- `compatibility_flags`: Node.js 호환성 활성화
- `main`: Worker 진입점 파일
- `[build]`: 빌드 명령어 설정
- `[assets]`: 정적 자산 디렉토리 설정

### 2. open-next.config.ts

OpenNext Cloudflare 어댑터 설정 파일입니다.

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});
```

**주요 설정:**
- `incrementalCache`: R2를 사용한 증분 캐싱 설정 (ISR 지원)

### 3. next.config.js

Next.js 설정 파일입니다.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        instrumentationHook: true,
    },
};

export default nextConfig;
```

**주요 설정:**
- `output: 'standalone'`: Cloudflare Workers 배포를 위한 필수 설정
- `instrumentationHook`: 계측 훅 활성화

### 4. 환경 변수 (.dev.vars)

로컬 개발 환경 변수 파일입니다.

```
NEXTJS_ENV=dev
```

> [!IMPORTANT]
> `.dev.vars` 파일은 로컬 개발용이며, 프로덕션 환경 변수는 Cloudflare 대시보드에서 설정해야 합니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 로컬 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 로컬 미리보기 (Cloudflare Workers 환경)

```bash
pnpm preview
```

실제 Cloudflare Workers 환경과 유사한 로컬 환경에서 테스트할 수 있습니다.

## 📦 빌드 및 배포

### 빌드

```bash
pnpm build
```

빌드 프로세스:
1. Next.js 애플리케이션 빌드
2. OpenNext Cloudflare 어댑터로 변환
3. `.open-next/worker.js`를 `_worker.js`로 복사

### 배포

```bash
pnpm deploy
```

또는 빌드 후 업로드만:

```bash
pnpm upload
```

### Wrangler 타입 생성

```bash
pnpm cf-typegen
```

Cloudflare 환경 변수에 대한 TypeScript 타입 정의를 생성합니다.

## ⚠️ 주의사항

### 1. Next.js 기능 제한사항

> [!WARNING]
> Cloudflare Workers는 Node.js 런타임이 아니므로 일부 Next.js 기능이 제한됩니다.

**제한되는 기능:**
- ❌ `fs` 모듈 사용 불가
- ❌ `child_process` 사용 불가
- ❌ 일부 Node.js 네이티브 모듈
- ⚠️ Edge Runtime에서만 작동하는 API 사용 권장

**지원되는 기능:**
- ✅ App Router
- ✅ Server Components
- ✅ API Routes
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR) - R2 사용 시
- ✅ Server-Side Rendering (SSR)

### 2. 빌드 설정

> [!CAUTION]
> `next.config.js`에서 `output: 'standalone'` 설정은 필수입니다. 이 설정이 없으면 Cloudflare Workers에 배포할 수 없습니다.

### 3. 환경 변수

**로컬 개발:**
- `.dev.vars` 파일 사용
- Git에 커밋하지 않도록 `.gitignore`에 추가 권장

**프로덕션:**
- Cloudflare 대시보드 > Workers > 설정 > 환경 변수에서 설정
- 또는 `wrangler secret put <KEY>` 명령어 사용

```bash
# 프로덕션 환경 변수 설정 예시
wrangler secret put DATABASE_URL
wrangler secret put API_KEY
```

### 4. 정적 자산

> [!NOTE]
> 정적 자산(이미지, 폰트 등)은 `.open-next/assets` 디렉토리에 자동으로 복사되며, Cloudflare의 CDN을 통해 제공됩니다.

### 5. 캐싱

**R2 Incremental Cache:**
- ISR을 사용하려면 Cloudflare R2 버킷이 필요합니다
- `open-next.config.ts`에서 `r2IncrementalCache` 설정 필요
- R2 버킷은 Cloudflare 대시보드에서 생성 후 `wrangler.toml`에 바인딩 추가

```toml
# R2 바인딩 예시 (필요시 추가)
[[r2_buckets]]
binding = "CACHE"
bucket_name = "your-cache-bucket"
```

### 6. 배포 전 체크리스트

- [ ] `pnpm build` 로컬 빌드 성공 확인
- [ ] `pnpm preview`로 로컬에서 테스트
- [ ] 환경 변수 Cloudflare에 설정 완료
- [ ] `wrangler.toml`의 `name` 확인
- [ ] R2 버킷 설정 (ISR 사용 시)

## 🔧 문제 해결

### 빌드 오류

**문제:** `opennextjs-cloudflare build` 실패

**해결:**
```bash
# 캐시 삭제 후 재빌드
rm -rf .next .open-next
pnpm build
```

### 배포 오류

**문제:** `wrangler deploy` 실패

**해결:**
```bash
# Wrangler 로그인 확인
wrangler whoami

# 로그인 필요시
wrangler login

# 재배포
pnpm deploy
```

### 런타임 오류

**문제:** Node.js 모듈 사용 오류

**해결:**
- Edge Runtime 호환 라이브러리로 교체
- `nodejs_compat` 플래그 확인 (`wrangler.toml`)
- 필요시 폴리필 추가

### 환경 변수 인식 안됨

**문제:** 환경 변수가 로드되지 않음

**해결:**
```bash
# 로컬: .dev.vars 파일 확인
cat .dev.vars

# 프로덕션: Cloudflare 대시보드에서 확인
wrangler secret list
```

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 📝 라이선스

이 프로젝트는 POC(Proof of Concept) 목적으로 작성되었습니다.
