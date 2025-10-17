import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cilPencil } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ roles, user, rolesIds }) {

    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }
    const {
        data,
        setData,
        errors,
        patch,
        processing,
        progress
    } = useForm({
        role_id: rolesIds[0] ?? "",
        phone: user.detail?.phone ?? "",
        email: user.email ?? "",
        firstname: user.firstname ?? "",
        lastname: user.lastname ?? "",
        profile_img: null,
    });
    

    const submit = (e) => {
        e.preventDefault();
        console.log("data à envoyer debut :", data);

        patch(route('user.update', user.id), {
            // forceFormData: true,
            onStart: () => {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Modification en cours ...</span>',
                    text: 'Veuillez patienter...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                });
            },
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>', // yellow text
                    text: 'Utilisateur modifié.e avec succès',
                    confirmButtonText: '😇 Fermer'
                })
                router.visit(route('user.index'));
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                console.log("data envoyé :", data);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilPencil} /> Modifier <span className="badge bg-light border rounded text-dark">{`${user.firstname} - ${user.lastname}`}</span>
                </h2>
            }
        >
            <Head title="Nouvel utilisateur" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('utilisateur.view') ?
                                (<div className="text-center items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("user.index")}>
                                        <CIcon icon={cilList} /> Liste des utilisateurs
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">

                                        {/* Firstname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="firstname" value="Nom" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="firstname"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Doe"
                                                value={data.firstname}
                                                onChange={(e) => setData('firstname', e.target.value)}
                                                autoComplete="firstname"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.firstname} />
                                        </div>

                                        {/* Lastname */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="lastname" value="Prénom" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                name="lastname"
                                                id="lastname"
                                                required
                                                placeholder="John"
                                                className='form-control mt-1 block w-full'
                                                value={data.lastname}
                                                onChange={(e) => setData('lastname', e.target.value)}
                                            />

                                            <InputError className="mt-2" message={errors.lastname} />
                                        </div>

                                        {/* Phone */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phoe" value="Numéro de télépone" ></InputLabel>
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="+2290156854397"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                autoComplete="phone"
                                            />
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Role */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="role_id" value="Affectez-lui un rôle" > <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un rôle ..."
                                                name="role_id"
                                                id="role_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={roles.map((role) => ({
                                                    value: role.id,
                                                    label: `${role.name}`,
                                                }))}
                                                value={roles
                                                    .map((role) => ({
                                                        value: role.id,
                                                        label: `${role.name}`,
                                                    }))
                                                    .find((option) => option.value === data.role_id)} // set selected option
                                                onChange={(option) => setData('role_id', option.value)} // update state with id
                                            />
                                            <InputError className="mt-2" message={errors.role_id} />
                                        </div>

                                        {/* Email */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > <span className="text-danger">*</span>  </InputLabel>
                                            <TextInput
                                                name="email"
                                                id="email"
                                                required
                                                placeholder="joe@gmail.com"
                                                className='form-control mt-1 block w-full'
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                    </div>
                                </div>

                                {/* Bouton */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
