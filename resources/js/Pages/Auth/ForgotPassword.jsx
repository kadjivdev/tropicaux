import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            icon: 'info',
            title: "Opération en cours ....",
            text: "Veuillez patienter pendant que nous vérifions vos informations.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();;
            }
        })

        post(route('password.email'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: "Opération réussie avec succès!",
                    text: "Demande de reinitialisation éffectuée avec succès! Un lien vous a été envoyé via mail.",
                })
            },
            onError: (errors) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: "Opération échouée!",
                    text: `${errors.exception ?? 'Erreure survenue lors de la demande de réinitialisation du mot de passe!'}`,
                })
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div uk-scrollspy="cls:uk-animation-slide-bottom" className="relative inline-block w-full max-w-md mx-auto ">
                {/* Fond jaune décalé */}
                <div
                    className="absolute bg-yellow-400"
                    style={{
                        top: "-5px",          // décale vers le bas
                        left: "-2px",         // décale vers la droite
                        width: "100%",
                        height: "100%",
                        borderRadius: "15px",
                        transform: "rotate(-2deg)",
                        zIndex: 0,
                    }}
                ></div>

                {/* Contenu au-dessus (le formulaire) */}
                <div className="relative z-10 bg-white rounded-xl shadow-lg p-6">

                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Vous avez oublié votre mot de passe ? Pas de problème. Indiquez-nous simplement votre adresse e-mail
                        et nous vous enverrons un lien pour réinitialiser votre mot de passe, qui vous permettra
                        d'en choisir un nouveau.
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}
                    <form onSubmit={submit}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            placeholder="joe@gmail.com"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                        <br />
                        <Link
                            href={route('register')}
                            className="border mt-3 rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Déjà inscrit ?
                        </Link>

                        <div className="mt-4 flex items-center justify-end">
                            {/* <PrimaryButton className="ms-4" disabled={processing}>
                        Email Password Reset Link
                    </PrimaryButton> */}


                            <button className="btn btn-sm w-100 bg-success text-white bg-hover rounded"><i class="bi bi-check2-circle"></i> Reinitialisation de mot de passe </button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
