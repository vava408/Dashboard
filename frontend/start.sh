#!/bin/sh
set -e

mkdir -p /var/lib/tailscale

# Tailscale needs an auth key supplied at runtime:
#   TS_AUTHKEY=tskey-...
if [ -z "$TS_AUTHKEY" ]; then
  echo "ERROR: TS_AUTHKEY is not set."
  exit 1
fi

tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock &
sleep 2

tailscale --socket=/var/run/tailscale/tailscaled.sock up   --authkey="$TS_AUTHKEY"   --hostname="${TS_HOSTNAME:-vue-app}"   ${TS_EXTRA_ARGS:-}

# Keep nginx in the foreground.
exec nginx -g 'daemon off;'
