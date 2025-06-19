import { useState } from 'react';

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';

/* ────────────────────────────
			TypeScript : shape du state
			──────────────────────────── */
interface FormData {
	name: string;
	email: string;
	mobile: string;
	company: string;
	position: string;
	formation: string;
	source: string;
	location: string;
}

export default function ContactForm() {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		mobile: '',
		company: '',
		position: '',
		formation: '',
		source: '',
		location: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
		type: '',
		message: '',
	});

	/* ─── handlers ─────────────────────────────────────── */

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSelectChange = (name: keyof FormData, value: string) =>
		setFormData((prev) => ({ ...prev, [name]: value }));

	/* seules les 4 clés indispensables : */
	const isFormValid = () => {
		const { name, mobile, source, location } = formData;
		return name.trim() && mobile.trim() && source.trim() && location.trim();
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isFormValid()) return;

		setIsSubmitting(true);
		setStatus({ type: '', message: '' });

		try {
			const response = await fetch('https://node.vispera-dz.com/api/send-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const payload = await response.json();

			if (response.ok) {
				setStatus({ type: 'success', message: 'Votre formulaire a été envoyé avec succès !' });
				/* reset */
				setFormData({
					name: '',
					email: '',
					mobile: '',
					company: '',
					position: '',
					formation: '',
					source: '',
					location: '',
				});
			} else {
				setStatus({ type: 'error', message: payload.error || "Erreur lors de l'envoi du formulaire" });
			}
		} catch (err) {
			setStatus({ type: 'error', message: `Erreur de connexion. Veuillez réessayer. ${err}` });
		} finally {
			setIsSubmitting(false);
		}
	};

	/* ─── UI ───────────────────────────────────────────── */

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4'>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-white shadow-lg rounded-lg p-8'>
					<h1 className='text-3xl font-bold text-center mb-8'>Formulaire d'inscription</h1>

					{/* noValidate : on gère la validation nous-mêmes */}
					<form onSubmit={handleSubmit} noValidate className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{/* Nom et prénom – OBLIGATOIRE */}
							<div className='space-y-2'>
								<Label htmlFor='name'>Nom et prénom *</Label>
								<Input
									id='name'
									name='name'
									placeholder='Jean Dupont'
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Email – facultatif */}
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='jean@example.com'
									value={formData.email}
									onChange={handleInputChange}
								/>
							</div>

							{/* Mobile – OBLIGATOIRE */}
							<div className='space-y-2'>
								<Label htmlFor='mobile'>Mobile *</Label>
								<Input
									id='mobile'
									name='mobile'
									type='tel'
									placeholder='06 12 34 56 78'
									value={formData.mobile}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Entreprise – facultatif */}
							<div className='space-y-2'>
								<Label htmlFor='company'>Nom de l'entreprise</Label>
								<Input
									id='company'
									name='company'
									placeholder="Nom de l'entreprise"
									value={formData.company}
									onChange={handleInputChange}
								/>
							</div>

							{/* Poste – facultatif */}
							<div className='space-y-2'>
								<Label htmlFor='position'>Poste de travail</Label>
								<Input
									id='position'
									name='position'
									placeholder='Votre poste actuel'
									value={formData.position}
									onChange={handleInputChange}
								/>
							</div>

							{/* Formation – facultatif */}
							<div className='space-y-2'>
								<Label htmlFor='formation'>Formation</Label>
								<Select value={formData.formation} onValueChange={(v) => handleSelectChange('formation', v)}>
									<SelectTrigger id='formation'>
										<SelectValue placeholder='Sélectionnez une formation' />
									</SelectTrigger>
									<SelectContent>
										{[
											'MBA-MOS',
											'MBA-DMK',
											'BAC-AGA',
											'EMBA-SNT',
											'EMBA-SFE',
											'MS-MAS',
											'MS-FIN',
											'MS-RH',
											'MS-MRK',
										].map((v) => (
											<SelectItem key={v} value={v}>
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Source – OBLIGATOIRE */}
							<div className='space-y-2'>
								<Label htmlFor='source'>Source *</Label>
								<Select value={formData.source} onValueChange={(v) => handleSelectChange('source', v)}>
									<SelectTrigger id='source'>
										<SelectValue placeholder='Comment nous avez-vous connu ?' />
									</SelectTrigger>
									<SelectContent>
										{['Meta', 'Salon', 'Passage'].map((v) => (
											<SelectItem key={v} value={v}>
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Lieu de formation – OBLIGATOIRE */}
							<div className='space-y-2'>
								<Label htmlFor='location'>Lieu de formation *</Label>
								<Select value={formData.location} onValueChange={(v) => handleSelectChange('location', v)}>
									<SelectTrigger id='location'>
										<SelectValue placeholder='Sélectionnez un lieu' />
									</SelectTrigger>
									<SelectContent>
										{['Alger', 'Constantine'].map((v) => (
											<SelectItem key={v} value={v}>
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Alerte succès / erreur */}
						{status.message && (
							<Alert className={status.type === 'success' ? 'border-green-500' : 'border-red-500'}>
								{status.type === 'success' ? (
									<CheckCircle className='h-4 w-4 text-green-500' />
								) : (
									<AlertCircle className='h-4 w-4 text-red-500' />
								)}
								<AlertDescription className={status.type === 'success' ? 'text-green-700' : 'text-red-700'}>
									{status.message}
								</AlertDescription>
							</Alert>
						)}

						{/* Bouton submit */}
						<Button type='submit' className='w-full' disabled={!isFormValid() || isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Envoi en cours…
								</>
							) : (
								'Envoyer'
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
