import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">🫠 Connexion en cours...</span>', // yellow text
            text: 'Veuillez patienter pendant que nous vérifions vos informations.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('login'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    // icon: 'success',
                    title: '<span style="color: #2a7348;">👌Connexion réussie </span>', // yellow text
                    text: 'Vous avez été connecté(e) avec succès.',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Connexion échouée </span>', // yellow text
                    text: 'Veuillez vérifier vos informations et réessayer.',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div uk-scrollspy="cls:uk-animation-slide-bottom" className="relative inline-block w-full max-w-md mx-auto ">
                {/* Fond jaune décalé */}
                <div
                    className="absolute "
                    style={{
                        top: "-5px",          // décale vers le bas
                        left: "-2px",         // décale vers la droite
                        width: "100%",
                        height: "100%",
                        // borderRadius:"50%",
                        transform: "rotate(-20deg)",
                        zIndex: 0,
                        backgroundColor:"#f0a135"
                    }}
                ></div>

                {/* Contenu au-dessus (le formulaire) */}
                <div className="relative z-10 bg-white rounded-xl p-6">

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 block flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <span className="border ms-2 text-sm text-gray-600 dark:text-gray-400">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="border rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                >
                                    Mot de passe oublié?
                                </Link>
                            )}

                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <button disabled={processing} className="btn btn-sm w-100 btn-dark text-white bg-hover rounded"><i className="bi bi-check2-circle"></i> {processing?'Connexion ...':' Se connecter'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
