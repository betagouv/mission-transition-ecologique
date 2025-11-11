artillery-local:
	artillery run artillery-test.yml --tags "env:local,service:cache" --record --key
artillery-preprod:
	artillery run artillery-test.yml --tags "env:preprod,service:cache" --record --key
artillery-personal:
	artillery run artillery-test.yml --tags "env:personal,service:cache" --record --key

doctor:
	PORT=4242 clinic doctor --on-port ‘4242’ -- node apps/nuxt/.output/server/index.mjs & CLINIC_PID=$!
