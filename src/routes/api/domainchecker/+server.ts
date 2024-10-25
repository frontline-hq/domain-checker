// src/routes/api/check-domain.json.ts

export async function GET({ url }) {
	const domain = url.searchParams.get('domain');

	if (!domain) {
		return new Response(
			JSON.stringify({
				status: 400,
				error: 'Domain parameter is required'
			})
		);
	}

	// Extract domain parts
	const domainParts = domain.includes('@') ? domain.split('@')[1].split('.') : domain.split('.');
	const checkedDomain = domainParts.slice(-2).join('.');

	const endpoint = `https://dns.quad9.net:5053/dns-query?name=_dmarc.${checkedDomain}&type=txt`;

	try {
		// Fetch DMARC record from Quad9
		const response = await fetch(endpoint);
		const res = await response.json();

		if (!res || !response.ok) {
			throw new Error('Error fetching DMARC record');
		}

		// Default safety status
		let domainIsSafe = false;
		let subDomainIsSafe = false;

		// Parse DMARC record if found
		if (res?.Answer) {
			const dmarcRecord = res.Answer.find(
				(a: { name: string }) => a.name === `_dmarc.${checkedDomain}.`
			);
			if (dmarcRecord) {
				const dmarcPolicy = dmarcRecord.data;
				const policy = dmarcPolicy.match(/p=(reject|quarantine|none)/)?.[1];
				const subdomainPolicy = dmarcPolicy.match(/sp=(reject|quarantine|none)/)?.[1];
				const pct = dmarcPolicy.match(/pct=(\d+)/)?.[1];

				// Determine if domain and subdomain are safe based on policy and pct values
				domainIsSafe = (policy === 'reject' || policy === 'quarantine') && (!pct || pct === '100');
				subDomainIsSafe = subdomainPolicy !== 'none';
			}
		}

		// Return JSON response with domain safety status

		return new Response(
			JSON.stringify({
				status: 200,
				domain: checkedDomain,
				domainIsSafe,
				subDomainIsSafe
			})
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				status: 500,
				domain: checkedDomain,
				domainIsSafe: false
			})
		);
	}
}
