import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilUserFollow, cilTrash } from '@coreui/icons'
import Swal from 'sweetalert2';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();
    const userAuth = usePage().props.auth.user

    console.log("userAuth",userAuth)

    const {
        data,
        setData,
        delete: destroy,
        processing,
        post,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours ...',
            text: 'Veuillez patienter quelque instant',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                Swal.fire({
                    icon: 'error',
                    title: "Opération éffectuée avec succès",
                    text: "Compte supprimé avec succès!",
                });

                // deconnexion
                post("logout")
            },
            onError: (errors) => {
                console.log(errors)
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${errors.exception?? 'Une erreure est survenue au cours de la suppression du compte! Réessayer.'}`,
                });
                passwordInput.current.focus();
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    <CIcon className='text-danger' icon={cilUserFollow} /> Suppression de compte
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Une fois votre compte supprimé, toutes ses ressources et données
                    seront définitivement supprimées. Avant de supprimer votre compte,
                    veuillez télécharger toutes les données ou informations que vous souhaitez
                    conserver.
                </p>
            </header>

            <DangerButton 
            disabled={userAuth?.school_id}
            onClick={confirmUserDeletion}>
                <CIcon icon={cilTrash} /> Supprimer le compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Êtes-vous sûr de vouloir supprimer votre compte ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois votre compte supprimé, toutes ses ressources et
                        données seront définitivement supprimées. Veuillez saisir votre
                        mot de passe pour confirmer que vous souhaitez supprimer définitivement
                        votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            <CIcon icon={cilTrash} />  Supprimer
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
