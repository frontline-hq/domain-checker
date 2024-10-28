FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install curl and add Infisical CLI
RUN apt-get update && apt-get install -y curl
RUN curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash
RUN apt-get update && apt-get install -y infisical

COPY . /app
WORKDIR /app

# Define build arguments for Infisical credentials
ARG INFISICAL_CLIENT_ID
ARG INFISICAL_CLIENT_SECRET
ARG INFISICAL_PROJECT_ID
RUN infisical run --token=$(infisical login --method=universal-auth --client-id="$INFISICAL_CLIENT_ID" --client-secret="$INFISICAL_CLIENT_SECRET" --silent --plain) --projectId="$INFISICAL_PROJECT_ID" --env="prod" -- bash -c 'pnpm config set "//registry.npmjs.org/:_authToken" "${NPM_TOKEN}"'

# Unified installation and build step
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --ignore-scripts
RUN bash -c 'pnpm run build'

EXPOSE 3000
CMD [ "pnpm", "start" ]