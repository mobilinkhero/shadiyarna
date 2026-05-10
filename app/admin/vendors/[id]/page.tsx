import PageHeader from '@/components/admin/PageHeader'
import VendorForm from '@/components/admin/VendorForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Ctx = { params: Promise<{ id: string }> }

export default async function EditVendorPage({ params }: Ctx) {
    const { id } = await params
    const vendor = await prisma.vendor.findUnique({ where: { id }, select: { id: true, name: true, slug: true } })
    if (!vendor) notFound()

    return (
        <div>
            <PageHeader title={`Edit: ${vendor.name}`} description={`Vendor slug: ${vendor.slug}`} />
            <VendorForm vendorId={id} />
        </div>
    )
}
