import PageHeader from '@/components/admin/PageHeader'
import VendorForm from '@/components/admin/VendorForm'

export default function NewVendorPage() {
    return (
        <div>
            <PageHeader title="Add New Vendor" description="Fill in the details to list a new vendor on the platform" />
            <VendorForm />
        </div>
    )
}
