import { useState } from 'react';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
	const [formData, setFormData] = useState({
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
	const [status, setStatus] = useState({ type: '', message: '' });

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setStatus({ type: '', message: '' });

		try {
			const response = await fetch('/api/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok) {
				setStatus({
					type: 'success',
					message: 'Votre formulaire a été envoyé avec succès!',
				});
				// Reset form
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
				setStatus({
					type: 'error',
					message: result.error || "Erreur lors de l'envoi du formulaire",
				});
			}
		} catch (error) {
			setStatus({
				type: 'error',
				message: `Erreur de connexion. Veuillez réessayer.${error}`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid = () => {
		return Object.values(formData).every((value) => value !== '');
	};

	return (
		<div className='min-h-screen bg-gray-50 py-12 px-4'>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-white shadow-lg rounded-lg p-8'>
					<h1 className='text-3xl font-bold text-center mb-8'>Formulaire d'inscription</h1>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Nom et prénom *</Label>
								<Input
									id='name'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									placeholder='Jean Dupont'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email'>Email *</Label>
								<Input
									id='email'
									name='email'
									type='email'
									value={formData.email}
									onChange={handleInputChange}
									placeholder='jean@example.com'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='mobile'>Mobile *</Label>
								<Input
									id='mobile'
									name='mobile'
									type='tel'
									value={formData.mobile}
									onChange={handleInputChange}
									placeholder='06 12 34 56 78'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='company'>Nom de l'entreprise *</Label>
								<Input
									id='company'
									name='company'
									value={formData.company}
									onChange={handleInputChange}
									placeholder='Nom de votre entreprise'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='position'>Poste de travail *</Label>
								<Input
									id='position'
									name='position'
									value={formData.position}
									onChange={handleInputChange}
									placeholder='Votre poste actuel'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='formation'>Formation *</Label>
								<Select
									value={formData.formation}
									onValueChange={(value) => handleSelectChange('formation', value)}>
									<SelectTrigger id='formation'>
										<SelectValue placeholder='Sélectionnez une formation' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='MBA-MOS'>MBA-MOS</SelectItem>
										<SelectItem value='MBA-DMK'>MBA-DMK</SelectItem>
										<SelectItem value='BAC-AGA'>BAC-AGA</SelectItem>
										<SelectItem value='EMBA-SNT'>EMBA-SNT</SelectItem>
										<SelectItem value='EMBA-SFE'>EMBA-SFE</SelectItem>
										<SelectItem value='MS-MAS'>MS-MAS</SelectItem>
										<SelectItem value='MS-FIN'>MS-FIN</SelectItem>
										<SelectItem value='MS-RH'>MS-RH</SelectItem>
										<SelectItem value='MS-MRK'>MS-MRK</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='source'>Source *</Label>
								<Select
									value={formData.source}
									onValueChange={(value) => handleSelectChange('source', value)}>
									<SelectTrigger id='source'>
										<SelectValue placeholder='Comment nous avez-vous connu?' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Meta'>Meta</SelectItem>
										<SelectItem value='Salon'>Salon</SelectItem>
										<SelectItem value='Passage'>Passage</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='location'>Lieu de Formation *</Label>
								<Select
									value={formData.location}
									onValueChange={(value) => handleSelectChange('location', value)}>
									<SelectTrigger id='location'>
										<SelectValue placeholder='Sélectionnez un lieu' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Alger'>Alger</SelectItem>
										<SelectItem value='Constantine'>Constantine</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

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

						<Button type='submit' className='w-full' disabled={!isFormValid() || isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Envoi en cours...
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
