import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react';
import { cilSend } from "@coreui/icons";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            icon: 'info',
            title: 'Opération en cours ...',
            text: "Veuillez patienter pendant que nous vérifions vos informations.",
            didOpen: () => {
                Swal.showLoading();
            }
        })

        post(route('password.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: "Opération réussie avec succès!",
                    text: "Reinitialisation éffectuée avec succès! Connectez-vous maintenant",
                })
            },
            onError: (errors) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: "Opération échouée!",
                    text: `${errors.exception ?? 'Erreure survenue lors de la réinitialisation du mot de passe!'}`,
                })
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                            />

                            <TextInput
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                <CIcon icon={cilSend} /> {processing ? 'Réinitiamlisation ...' : 'Réinitialiser'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>


        </GuestLayout>
    );
}
