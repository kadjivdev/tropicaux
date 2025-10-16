import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilLibraryAdd } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ schools }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }
    const {
        data,
        setData,
        errors,
        post,
        processing,
        progress
    } = useForm({
        school_id: "",
        phone: "",
        email: "",
        firstname: "",
        lastname: "",
        profile_img: "",
        password: "",
        confirm_password: ""
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('user.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Utilisateur créée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Nouvel Utilisateur
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
                                        <CIcon icon={cilArrowCircleLeft} /> Liste des utilisateurs
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* École */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="École concernée" > <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={schools.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))}
                                                value={schools
                                                    .map((school) => ({
                                                        value: school.id,
                                                        label: `${school.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />
                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>


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

                                        {/* Phone */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phome" value="Numéro de télépone" ><span className="text-danger">*</span> </InputLabel>
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

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="profile_img" value="Photo de profil" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="profile_img"
                                                type="file"
                                                className="mt-1 block w-full"
                                                // required
                                                onChange={(e) => setData('profile_img', e.target.files[0])}
                                                autoComplete="profile_img"
                                            />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}

                                            <InputError className="mt-2" message={errors.profile_img} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
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

                                        {/* Email */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > <span className="text-danger">*</span> </InputLabel>
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

                                        <div className="mb-3">
                                            <InputLabel htmlFor="password" value="Mot de passe" ><span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />

                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirmation de mot de passe"
                                            > <span className="text-danger">*</span> </InputLabel>

                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) =>
                                                    setData('password_confirmation', e.target.value)
                                                }
                                                required
                                            />

                                            <InputError
                                                message={errors.password_confirmation}
                                                className="mt-2"
                                            />
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
