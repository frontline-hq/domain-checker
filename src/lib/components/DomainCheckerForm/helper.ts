import * as yup from 'yup';
import * as m from '$lib/paraglide/messages.js';

export const schema = yup.object({
	domain: yup
		.string()
		.matches(
			/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$|^[\w-+]+(\.[\w-]+)*@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,7})$/,
			`${m.domaincheckerformdomainerrormessage()}`
		)
		.required()
});
export async function submitHandler({ inputValue }: { inputValue: string }) {
	const domainParts = inputValue.includes('@')
		? inputValue.split('@')[1].split('.')
		: inputValue.split('.');
	const domain = domainParts.slice(-2).join('.');
	// This will throw if domin is not a valid domain.
	const { domain: validatedDomain } = await schema.validate({ domain });
	const endpoint = `https://dns.quad9.net:5053/dns-query?name=_dmarc.${validatedDomain}&type=txt`;
	const response = await fetch(endpoint, {
		method: 'GET'
	});
	const res = await response.json();
	if (!res) {
		throw new Error('No response received');
	}
	if (!response.ok) {
		throw new Error(res);
	}
	return { ...res, domainParts, domain };
}
export function successHandler(
	response:
		| { Answer: { name: string; data: string }[]; domain: string; domainParts: string[] }
		| undefined
) {
	if (response?.Answer) {
		const dmarcRecord = response.Answer.find(
			(a: { name: string | undefined }) => a.name === `_dmarc.${response.domain}.`
		);
		if (dmarcRecord) {
			const dmarcPolicy = dmarcRecord.data;
			const policy = dmarcPolicy.match(/p=(reject|quarantine|none)/)?.[1];
			const subdomainPolicy = dmarcPolicy.match(/sp=(reject|quarantine|none)/)?.[1];
			const pct = dmarcPolicy.match(/pct=(\d+)/)?.[1];
			const domainIsSafe =
				(policy === 'reject' || policy === 'quarantine') && (!pct || pct === '100');
			const subDomainIsSafe = response.domainParts.length <= 2 || subdomainPolicy !== 'none';
			return { domainIsSafe, subDomainIsSafe };
		}
	}
	return { domainIsSafe: false, subDomainIsSafe: false };
}
export async function checkWithoutSubmit({ inputValue }: { inputValue: string }) {
	return successHandler(await submitHandler({ inputValue }));
}
