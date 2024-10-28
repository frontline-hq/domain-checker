{{$secrets := secret "34de41e7-5764-4610-ba0a-e5b414652b2f" "staging" "/"}}
{{- with $secrets }}
{{- range $secret := . }}
vercel env rm {{$secret.Key}} preview --yes || echo '{{$secret.Value}}' | vercel env add {{$secret.Key}} preview
{{- end }}
{{- end }}