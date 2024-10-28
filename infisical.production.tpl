{{$secrets := secret "34de41e7-5764-4610-ba0a-e5b414652b2f" "prod" "/"}}
{{- with $secrets }}
{{- range $secret := . }}
vercel env rm {{$secret.Key}} production --yes || echo '{{$secret.Value}}' | vercel env add {{$secret.Key}} production
{{- end }}
{{- end }}