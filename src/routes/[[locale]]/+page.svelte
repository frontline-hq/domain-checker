<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { communicationPhone as phoneCall } from '@frontline-hq/untitledui-icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import calFn from '@calcom/embed-snippet';
	import { page } from '$app/stores';
	import {
		McUtilActions,
		McHeroHeaderSectionFormWrapper
	} from '@frontline-hq/uui/marketing-components';
	import DomainCheckerForm from '$lib/components/DomainCheckerForm/DomainCheckerForm.svelte';
	import {
		generalSlashCircle01,
		securityShield01,
		arrowsArrowUpLeft,
		generalXClose
	} from '@frontline-hq/untitledui-icons';

	let domainCheckerForm: DomainCheckerForm;
	let domain: string | undefined;
	let domainIsSafe: boolean | undefined;
	let subDomainIsSafe: boolean | undefined;

	onMount(() => {
		const Cal = calFn('https://app.cal.com/embed/embed.js');
		Cal('init', { origin: 'https://cal.com' });

		Cal('ui', {
			styles: { branding: { brandColor: '#000000' } },
			hideEventTypeDetails: false,
			layout: 'month_view'
		});
	});
	function useDomainOverlay(_: HTMLElement) {
		document.body.style.overflowY = 'hidden';
		return {
			destroy() {
				document.body.style.overflowY = 'auto';
			}
		};
	}
	$: console.log($page.url.searchParams.get('redirect-to'));
</script>

<svelte:head>
	<title>{m.pageheadtitle()}</title>
	<meta name="description" content={m.pageheadmetadescription()} />
	<link rel="canonical" href="https://www.frontline.codes" />
	<meta property="og:title" content={m.pageheadogtitle()} />
	<meta property="og:description" content={m.pageheadogdescription()} />
	<meta property="og:image" content="https://www.frontline.codes/static/frontline-logo.png" />
	<meta property="og:url" content="https://www.frontline.codes" />
	<meta name="robots" content="index, follow" />
	<!-- Add this in later, when added to google-site-verification -->
	<!-- <meta name="google-site-verification" content="Bq4e8ICS3Kqjp-0k2C-1PSX5cnY9btnGGI0ipjlYsds" /> -->
	<!-- Update this value if needed -->
	<link rel="icon" type="image/x-icon" href="/favicon.png" />
	<!-- Update the favicon path if needed -->
</svelte:head>
{#if browser}
	{#if domain !== undefined && domainIsSafe !== undefined}
		<div
			use:useDomainOverlay
			class="bg-uui-bg-primary/70 backdrop-blur-md z-10 fixed w-full h-full top-0"
		>
			<tdc-button-a
				class="absolute right-0 m-8"
				tdc={{
					size: { default: 'md', 'uui-desktop': 'lg' },
					destructive: 'false',
					hierarchy: 'secondary',
					coloring: 'gray'
				}}
				href={$page.url.searchParams.get('redirect-to')}
				type="button"
				on:click={() => {
					domainCheckerForm.resetForm();
				}}
				icon={{ type: 'icon-only', leading: generalXClose }}
			/>
			<div class="flex items-center justify-center w-full h-full">
				<tdc-mc-hs
					tdc={{ breakpoint: { default: 'mobile', 'uui-desktop': 'desktop' }, type: 'center' }}
				>
					<h6 slot="subheading">
						<tdc-badge
							icon={{
								type: 'icon',
								leading: domainIsSafe ? securityShield01 : generalSlashCircle01
							}}
							tdc={{
								size: 'lg',
								color: domainIsSafe ? 'success' : 'error',
								badgeType: 'Pill color'
							}}
							>{domainIsSafe
								? `${m.domaincheckeroverlaybadgeprotected()}`
								: `${m.domaincheckeroverlaybadgenotprotected()}`}</tdc-badge
						>
					</h6>
					<!-- TODO continue here scheint geschützt zu sein. -->
					<h2 slot="heading">
						{domain}
						{domainIsSafe
							? `${m.domaincheckeroverlaytitleprotected()}`
							: `${m.domaincheckeroverlaytitlenotprotected()}`}
						<!-- This h4 only pops-up when a domainIsSafe but has false subdomain-protection settings -->
						<h4 class="uui-text-lg">
							{!subDomainIsSafe && domainIsSafe ? `${m.domaincheckeroverlaysubdomaintitle()}` : ''}
						</h4>
					</h2>
					<p>
						{domainIsSafe
							? `${m.domaincheckeroverlaydomainissafetext()}`
							: `${m.domaincheckeroverlaydomainisnotsafetext()}`}
					</p>
					<p>
						{domainIsSafe ? '' : `${m.domaincheckeroverlaydomainisnotsafetext2()}`}
					</p>
					<p>
						{domainIsSafe ? '' : `${m.domaincheckeroverlaydomainisnotsafetext3()}`}
					</p>

					<McUtilActions slot="after">
						<!-- Domain contains a redirect parameter -->
						<tdc-button-a
							tdc={{
								size: { default: 'xl', 'uui-desktop': 'xl' },
								destructive: 'false',
								hierarchy: 'secondary',
								coloring: 'gray'
							}}
							type="button"
							href={$page.url.searchParams.get('redirect-to')}
							on:click={() => {
								domainCheckerForm.resetForm();
							}}
							icon={{ type: 'icon', leading: arrowsArrowUpLeft }}
							>{m.domaincheckeroverlaycta1()}</tdc-button-a
						>
						<tdc-button
							data-cal-link="frontline-meeting/20-Minute-Discovery-Session"
							data-cal-config={JSON.stringify({ layout: 'month_view' })}
							tdc={{
								size: { default: 'xl', 'uui-desktop': 'xl' },
								destructive: 'false',
								hierarchy: 'primary',
								coloring: 'color'
							}}
							icon={{ type: 'icon', leading: phoneCall }}>{m.domaincheckeroverlaycta2()}</tdc-button
						>
					</McUtilActions>
				</tdc-mc-hs>
			</div>
		</div>
	{/if}

	<div class="min-h-[calc(100vh-8rem)] flex flex-col justify-center">
		<tdc-mc-hhs
			id="domaintester"
			class="scroll-mt-24"
			tdc={{ breakpoint: { default: 'mobile', 'uui-desktop': 'desktop' }, type: 'splitform02' }}
		>
			<h2>{m.domaincheckerheading()}</h2>
			<p>
				{m.domaincheckersubtitle()}
			</p>
			<!-- this div is tdc-hhs-form-wrapper make this a component with different types like before -->
			<div class="w-full" id="domaincheckerform" slot="after">
				<McHeroHeaderSectionFormWrapper>
					<div
						class="flex text-white items-center w-full h-full mb-uui-3xl space-x-uui-xl"
						slot="logo"
					>
						<img
							src="/google-logo.svg"
							class="w-[5rem] h-[5rem] lg:w-[5.5rem] lg:h-[5.5rem] [&&]:m-0"
							alt="Google logo"
						/>

						<img
							src="/yahoo-logo.svg"
							class="w-[5rem] h-[5rem] lg:w-[5.5rem] lg:h-[5.5rem] [&&]:m-0"
							alt="Yahoo logo"
						/>
					</div>
					<h4 slot="title">{m.domaincheckerformheading()}</h4>
					<span slot="subtitle">{m.domaincheckerformsubtitle()} </span>
					<!-- Todo might be a solution for not setting classes on the form slot -->
					<DomainCheckerForm
						bind:this={domainCheckerForm}
						bind:domain
						bind:domainIsSafe
						bind:subDomainIsSafe
						slot="form"
					/>
					<div class="space-x-uui-xs flex justify-center items-center" slot="footnote">
						<span>
							{m.domaincheckerformfooter1()}
							<span class="flex flex-row items-center justify-center space-x-uui-md"
								><span class="">{m.domaincheckerformfooter2()}</span>
								<span class="underline underline-offset-2">{m.domaincheckerformfooter3()}</span>
								<span> {m.domaincheckerformfooter4()} </span>
							</span>
						</span>
					</div></McHeroHeaderSectionFormWrapper
				>
			</div>
		</tdc-mc-hhs>
	</div>
{/if}
