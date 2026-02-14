#!/usr/bin/env bash
set -e

#############################################
# CONFIG
#############################################
PROJECT_NAME="questionbankpro-dev"
NODE_MIN=18

#############################################
# NODE CHECK
#############################################
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt "$NODE_MIN" ]; then
  echo "❌ Node $NODE_MIN+ required"
  exit 1
fi

#############################################
# YARN (COREPACK) & PROJECT INIT
#############################################
corepack enable
corepack prepare yarn@stable --activate

# Create project without installing dependencies yet so we can configure Yarn
yarn create next-app "$PROJECT_NAME" \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-yarn \
  --skip-install

cd "$PROJECT_NAME"

# FIX YARN 4 FOR TURBOPACK COMPATIBILITY
echo 'nodeLinker: node-modules' >> .yarnrc.yml

#############################################
# FIX NEXT CONFIG (LATEST STABLE)
#############################################
cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
EOF

#############################################
# DEPENDENCIES (LATEST & STABLE)
#############################################
# mongodb pinned to ^6.10 for Auth.js adapter compatibility
yarn add \
  nextjs-toploader \
  mongoose \
  next-auth@beta \
  @auth/mongodb-adapter \
  mongodb@^6.10.0 \
  bcryptjs \
  zustand \
  uuid \
  nodemailer@^6.9.0 \
  lucide-react \
  @radix-ui/react-dialog \
  chart.js \
  react-chartjs-2 \
  @vercel/speed-insights

yarn add -D \
  @types/node \
  @types/react \
  @types/nodemailer \
  eslint-plugin-react-hooks \
  @next/eslint-plugin-next

#############################################
# SHADCN & INSTALL
#############################################
yarn install
npx shadcn@latest init -d

echo ""
echo "✅ Setup complete"
echo "🚀 Next.js 15 + React 19 + Auth.js v5 Ready"
echo "▶ cd $PROJECT_NAME && yarn dev"

yarn add react-icons
yarn add @vercel/analytics
yarn add class-variance-authority clsx tailwind-merge
# Buttons
npx shadcn@latest add button

# Cards
npx shadcn@latest add card

# Input fields
npx shadcn@latest add input

# Avatars
npx shadcn@latest add avatar

# Dialogs
npx shadcn@latest add dialog

# Dropdown Menu
npx shadcn@latest add dropdown-menu

# Menubar
npx shadcn@latest add menubar

# Navigation Menu
npx shadcn@latest add navigation-menu

# Select
npx shadcn@latest add select

# Tabs
npx shadcn@latest add tabs

# Toast (notifications)
npx shadcn@latest add sonner

# Tooltip
npx shadcn@latest add tooltip

npx shadcn@latest add skeleton

yarn add @fortawesome/fontawesome-free
