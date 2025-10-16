import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import CIcon from '@coreui/icons-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { cilUserFollow, cilSend } from '@coreui/icons'
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours ...',
            text: 'Veuillez patienter quelque instant',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }

        })

        patch(route('profile.update'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: "Opération éffectuée avec succès",
                    text: "Profile modifié avec succès",
                })
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: 'Une erreure est survenue au cours de l\'opération! Réessayer.',
                });
            }
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    <CIcon className='text-danger' icon={cilUserFollow} />  Vos Information de compte
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Mettez à jour les informations de profil et l'adresse e-mail de votre compte.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="lastname" value="Lastname" />

                    <TextInput
                        id="lastname"
                        className="mt-1 block w-full"
                        value={data.lastname}
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                        isFocused
                        autoComplete="lastname"
                    />

                    <InputError className="mt-2" message={errors.lastname} />
                </div>

                <div>
                    <InputLabel htmlFor="firstname" value="Firstname" />

                    <TextInput
                        id="firstname"
                        className="mt-1 block w-full"
                        value={data.firstname}
                        onChange={(e) => setData('firstname', e.target.value)}
                        required
                        isFocused
                        autoComplete="firstname"
                    />

                    <InputError className="mt-2" message={errors.firstname} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Votre adresse e-mail n'est pas vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Cliquez ici pour renvoyer l'e-mail de vérification.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Un nouveau lien de vérification a été envoyé à votre
                                adresse e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
