<script lang="ts">
	import {
		generalLoading01,
		alertAndFeedbackAlertCircle,
		generalSearchSm
	} from '@frontline-hq/untitledui-icons';
	import * as m from '$lib/paraglide/messages.js';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-yup';
	import { page } from '$app/stores';
	import { schema, submitHandler, successHandler } from './helper';

	export let domain: string | undefined;
	export let domainIsSafe: boolean | undefined;
	export let subDomainIsSafe: boolean | undefined;

	let submissionTimeoutId: NodeJS.Timeout | undefined;
	let submissionState: 'success' | 'error' | undefined;
	let formRef: HTMLFormElement | undefined;

	$: if ($page.url.searchParams.get('domain') && formRef) {
		formRef.requestSubmit();
	}

	function successSideEffects({
		reset,
		handlerResult
	}: {
		reset: () => void;
		handlerResult: ReturnType<typeof successHandler>;
	}) {
		domainIsSafe = handlerResult.domainIsSafe;
		subDomainIsSafe = handlerResult.subDomainIsSafe;
		if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
		submissionState = 'success';
		reset();
		submissionTimeoutId = setTimeout(() => {
			submissionState = undefined;
		}, 3000);
	}

	function errorSideEffects() {
		if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
		submissionState = 'error';
		submissionTimeoutId = setTimeout(() => {
			submissionState = undefined;
		}, 3000);
	}

	function resetSideEffects() {
		if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
		submissionState = undefined;
		domain = undefined;
		domainIsSafe = undefined;
		subDomainIsSafe = undefined;
	}

	const { form, errors, data, isSubmitting, reset } = createForm({
		initialValues: {
			domain: $page.url.searchParams.get('domain') ?? undefined
		},
		extend: validator({ schema }),
		onSubmit: async (values) => {
			if (submissionTimeoutId != undefined) clearTimeout(submissionTimeoutId);
			submissionState = undefined;
			domain = values.domain;
			return await submitHandler({ inputValue: values.domain });
		},
		onSuccess(response: any) {
			const handlerResult = successHandler(response);
			successSideEffects({ reset, handlerResult });
		},
		onError(err, context) {
			errorSideEffects();
		}
	});

	export function resetForm() {
		resetSideEffects();
		reset();
	}
</script>

<form bind:this={formRef} use:form class="w-full flex justify-center items-center">
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
