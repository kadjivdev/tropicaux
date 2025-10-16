import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { cilLockLocked, cilSend } from '@coreui/icons'
import {CIcon} from '@coreui/icons-react';
import Swal from 'sweetalert2';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        post,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours ...',
            text: 'Veuillez patienter quelque instant',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: "Opération éffectuée avec succès",
                    text: "Mot de passe modifié avec succès | Reconnectez-vous à nouveau!",
                });

                reset();

                // Deconnexion après
                post("logout");
            },
            onError: (errors) => {

                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: 'Une erreure est survenue au cours de l\'opération! Verifiez et Réessayer.',
                });

                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }

            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    <CIcon className='text-danger mr-2' icon={cilLockLocked} />
                    Modification de mot de passe
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester
                    sécurisé.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Mot de passe actuel"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmation du mot de passse"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}><CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'}</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
