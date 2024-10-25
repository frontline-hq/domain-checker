<script lang="ts">
	import {
		generalLoading01,
		alertAndFeedbackAlertCircle,
		generalSearchSm
	} from '@frontline-hq/untitledui-icons';
	import * as yup from 'yup';
	import * as m from '$lib/paraglide/messages.js';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';

	export let checkedDomain: string | undefined;
	export let domainIsSafe: boolean | undefined;
	export let subDomainIsSafe: boolean | undefined;

	const schema = yup.object({
		domain: yup
			.string()
			.matches(
				/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$|^[\w-+]+(\.[\w-]+)*@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,7})$/,
				`${m.domaincheckerformdomainerrormessage()}`
			)
			.required()
	});

	let submissionTimeoutId: NodeJS.Timeout | undefined;
	let submissionState: 'success' | 'error' | undefined;

	const { form, errors, data, isSubmitting, reset } = createForm({
		initialValues: {
			domain: ''
		},
		extend: validator({ schema }),
		onSubmit: async (values) => {
			if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
			submissionState = undefined;

			const domainParts = values.domain.includes('@')
				? values.domain.split('@')[1].split('.')
				: values.domain.split('.');
			checkedDomain = domainParts.slice(-2).join('.');
			const endpoint = `https://dns.quad9.net:5053/dns-query?name=_dmarc.${checkedDomain}&type=txt`;

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
			return { ...res, domainParts };
		},
		onSuccess(response: any) {
			domainIsSafe = false;
			subDomainIsSafe = false;
			document.body.style.overflowY = 'hidden';
			if (response?.Answer) {
				const dmarcRecord = response.Answer.find(
					(a: { name: string | undefined }) => a.name === `_dmarc.${checkedDomain}.`
				);
				if (dmarcRecord) {
					const dmarcPolicy = dmarcRecord.data;
					const policy = dmarcPolicy.match(/p=(reject|quarantine|none)/)?.[1];
					const subdomainPolicy = dmarcPolicy.match(/sp=(reject|quarantine|none)/)?.[1];
					const pct = dmarcPolicy.match(/pct=(\d+)/)?.[1];

					domainIsSafe =
						(policy === 'reject' || policy === 'quarantine') && (!pct || pct === '100');
					if (response.domainParts.length > 2 && subdomainPolicy === 'none') {
						subDomainIsSafe = false;
					} else {
						subDomainIsSafe = true;
					}
				}
			}
			if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
			submissionState = 'success';
			reset();
			submissionTimeoutId = setTimeout(() => {
				submissionState = undefined;
			}, 3000);
		},
		onError(err, context) {
			if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
			submissionState = 'error';
			submissionTimeoutId = setTimeout(() => {
				submissionState = undefined;
			}, 3000);
		}
	});

	export function resetForm() {
		if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
		submissionState = undefined;
		checkedDomain = undefined;
		domainIsSafe = undefined;
		subDomainIsSafe = undefined;
		reset();
	}
</script>

<form use:form class="w-full flex justify-center items-center">
	<tdc-mc-util-form tdc={{ type: 'login' }}>
		<tdc-input
			bind:value={$data['domain']}
			tdc={{ size: 'md' }}
			type="domain"
			destructive={$errors['domain'] !== null}
			placeholder={m.domaincheckerplaceholder()}
			disabled={false}
			hint={$errors['domain'] ?? undefined}
		>
			<span slot="label">{m.domaincheckerformlabel()}</span>
		</tdc-input>
		{#if submissionState === 'error'}
			<tdc-button
				type="submit"
				tdc={{
					size: 'xl',
					destructive: 'true',
					hierarchy: 'primary',
					coloring: 'color'
				}}
				disabled={false}
				icon={{ type: 'icon', leading: alertAndFeedbackAlertCircle }}
			>
				{m.domaincheckersubmitbuttonerrortext()}</tdc-button
			>
		{:else}
			<tdc-button
				type="submit"
				tdc={{
					size: 'lg',
					destructive: 'false',
					hierarchy: 'primary',
					coloring: 'color'
				}}
				disabled={$data['domain'] ? false : true || $isSubmitting}
				icon={{
					type: 'icon',
					leading: $isSubmitting
						? generalLoading01
						: submissionState === 'success'
							? undefined
							: generalSearchSm
				}}
			>
				{#if $isSubmitting}
					{m.domaincheckersubmitbuttonissubmittingtext()}
				{:else if submissionState === 'success'}
					{m.domaincheckersubmitbuttonsubmissionsuccestext()}
				{:else}
					{m.domaincheckersubmitbuttonctatext()}
				{/if}</tdc-button
			>
		{/if}
	</tdc-mc-util-form>
</form>
